const db = require('../config/db.config') ;

// export const getAllProducts2 = (req, res) => {
//     const {page, itemsPerPage} = req.body
//
//     db.promise().query(`;`)
//         .then((result) => {
//             if (result != null) {
//                 return res.status(200).send(result);
//             } else {
//                 return res.status(400).json({msg: 'No Products Available For Display!'});
//             }
//         })
//         .catch(err => {
//             return res.status(400).json({msg: err.message});
//         });
// }

