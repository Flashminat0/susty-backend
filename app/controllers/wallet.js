import db from '../config/db.config';

const {Wallet} = db;

export const fetchWallet = (req, res) => {
    const {userId} = req.body;

    Wallet.findOne({
        where: {
            userId: userId,
        },
    }).then((walletDetails) => {
        return res.status(200).json({
            success: true,
            message: 'Wallet found',
            walletDetails,
        });
    })

}