import {Op} from "sequelize";

const db = require('../config/db.config');
const {Product} = db;

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const {customAlphabet} = require('nanoid')

require("dotenv").config();

export const getAllProducts = (req, res) => {
    Product.findAll({
        where: {
            isPublished: true,
        }
    }).then(results => {
        return res.status(200).json({
            totalItems: results.length, products: results,
        });
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            message: "Error!", error: error,
        });
    });
}


//for params url (products/view/:id)
export const getProductById = (req, res) => {
    let {productId} = req.query;

    Product.findOne({
        where: {
            id: productId,
        }
    }).then(product => {
        return res.status(200).json({
            product: product,
        });
    }).catch(error => {
        // log on console
        console.log(error);

        return res.status(500).json({
            message: "Error!", error: error,
        });
    });
}

export const productPagination = (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        const offset = page ? page * limit : 0;

        Product.findAndCountAll({limit: limit, offset: offset})
            .then(data => {
                const totalPages = Math.ceil(data.count / limit);
                const response = {
                    message: "Paginating is completed! Query parameters: page = " + page + ", limit = " + limit, data: {
                        "totalItems": data.count,
                        "totalPages": totalPages,
                        "limit": limit,
                        "currentPageNumber": page + 1,
                        "currentPageSize": data.rows.length,
                        "products": data.rows,
                    },
                };
                res.send(response);
            });
    } catch (error) {
        res.status(500).send({
            message: "Error -> Can NOT complete a paging request!", error: error.message,
        });
    }
}


export const addProduct = (req, res) => {
    let {userId} = req.body;

    console.log(req.body.purchaseTags);

    let purchaseTagsArr = '';
    req.body.purchaseTags.every((value) => purchaseTagsArr += `${value};`)

    try {
        let product = {
            name: req.body.name,
            description: req.body.description,
            sellerId: userId,
            long_description: req.body.long_description,
            purchase_note: req.body.purchase_note,
            category: req.body.productCategory,
            refundable: req.body.refundable,
            usability: req.body.usability,
            stock: req.body.stock,
            images: req.body.images,
            price: req.body.price,
            isPublished: req.body.isPublished,
            mainProductCategory: req.body.mainProductCategory,
            brand: req.body.brand,
            color: req.body.selectedColor,
            size: req.body.sizeOption,
            purchaseTags: purchaseTagsArr,
            shippingMethod: req.body.shippingMethod,
            shippingMethodObj: req.body.shippingMethodObj,
        };


        console.log(product);

        Product.create(product).then(result => {
            return res.status(200).json({
                message: "Product is added successfully!", product: result,
            });
        }).catch(error => {
            console.log(error);
            return res.status(500).json({
                message: "Error!", error: error,
            });
        });
    } catch (error) {
        return res.status(500).json({
            message: "Add Product Failed!", error: error.message,
        });
    }
}


export const updateProduct = async (req, res) => {
    let {userId} = req.body;

    try {
        let product = {
            name: req.body.name,
            description: req.body.description,
            sellerId: userId,
            long_description: req.body.long_description,
            purchase_note: req.body.purchase_note,
            refundable: req.body.refundable,
            usability: req.body.usability,
            stock: req.body.stock,
            images: req.body.images,
            price: req.body.price,
            isPublished: req.body.isPublished,
        };

        let result = await product.save();

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error -> Cannot update the product with id = " + req.params.id, error: error.message,
        });
    }
}


export const deleteProduct = async (req, res) => {
    let {userId, productId} = req.body;


    try {
        let product = await Product.findOne({
            where: {
                id: productId, sellerId: userId,
            }
        });

        if (!product) {
            res.status(404).json({
                message: "Does Not exist the Product with id = " + productId, error: "404",
            });
        } else {
            await product.destroy().then(() => {
                Product.findAll({
                    where: {
                        sellerId: userId,
                    }
                }).then(result => {
                    res.status(200).json(result);
                });
            });

        }
    } catch (error) {
        res.status(500).json({
            message: "Error -> Cannot delete the product with id = " + req.params.id, error: error.message,
        });
    }
}


export const fetchSellerProductList = (req, res) => {
    try {
        let {userId} = req.body;
        Product.findAll({
            where: {
                sellerId: userId,
            }
        }).then(productList => {
            if (!productList) {
                res.status(404).json({
                    message: "Does Not exist the Product with seller id = " + userId, error: "404",
                });
            } else {
                res.status(200).json(productList);
            }
        });


    } catch (error) {
        res.status(500).json({
            message: "Error -> Cannot delete the product with id = " + req.params.id, error: error.message,
        });
    }
}


aws.config.update({
    accessKeyId: process.env.spaces_access_key_id, secretAccessKey: process.env.spaces_secret_access_key,
});

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(process.env.ENDPOINT_URL_DIGITALOCEAN);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
});

export const addImage = (req, res) => {
    const {file} = req.file;

    const upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.BUCKET_NAME_DIGITALOCEAN,
            acl: 'public-read',
            key: function (request, file, cb) {
                console.log(file);
                //todo be changed
                cb(null, file.originalname);
            },
        }),
    }).array('upload', 1);


    upload(req, res, function (error) {
        if (error) {
            console.log(error);
            return res.status(400).json({
                message: "Error -> Cannot upload the image", error: error.message,
            });
        }
        console.log('File uploaded successfully.');
        res.status(200).json({
            message: "Successfully uploaded the image", error: "200",
        });
    });
}


export const publishProduct = (req, res) => {
    const {productId, userId} = req.body;

    Product.update({
        isPublished: 1,
    }, {
        where: {
            id: productId,
            sellerId: userId,
        },
    }).then(() => {
        Product.findAll({
            where: {
                sellerId: userId,
            }
        }).then(product => {
            res.status(200).json(product);
        });
    }).catch(() => {
        res.status(500).json({
            message: "Error -> Cannot publish the product", status: "500",
        });
    });
}

export const unpublishProduct = (req, res) => {
    const {productId, userId} = req.body;

    Product.update({
        isPublished: 0,
    }, {
        where: {
            id: productId,
            sellerId: userId,
        },
    }).then(() => {
        Product.findAll({
            where: {
                sellerId: userId,
            }
        }).then(product => {
            res.status(200).json(product);
        });
    }).catch(() => {
        res.status(500).json({
            message: "Error -> Cannot unpublish the product", status: "500",
        });
    });
}

export const filterProductsToUser = (req, res) => {

    const filters = req.query;

    for (const queryKey in req.query) {
        if (filters[queryKey] === '' || filters[queryKey] === null || filters[queryKey] === undefined) {
            delete filters[queryKey];
        }
    }

    Product.findAll({
        where: {
            ...filters,
            isPublished: 1,
        }
    }).then(customers => {
        return res.status(200).json(customers);
    }).catch(err => {
        res.status(500).json({
            message: err.message
        });
    });

}
