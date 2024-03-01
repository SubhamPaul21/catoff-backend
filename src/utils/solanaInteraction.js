

const {
	Connection,
	Transaction,
	PublicKey,
	SystemProgram,
	sendAndConfirmTransaction,
	Keypair,
	clusterApiUrl,
} = require("@solana/web3.js");
require("dotenv").config();

const bs58 = require("bs58");
const environment = process.env.ENVIRONMENT;
const devNet = new Connection(clusterApiUrl("devnet"), "confirmed");
const mainNet = new Connection("https://api.mainnet-beta.solana.com");  //"https://mainnet.helius-rpc.com/?api-key=84665c7c-6f9c-4d82-a78d-dea2b9705c1c
const connection = environment == "dev" ? devNet : mainNet;

module.exports.withdrawSol=async (recipientPublicKeyBase58,am) => {
	try {
		const keypair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));

		const recipientPublicKey = new PublicKey(recipientPublicKeyBase58);

		if (typeof am !== "number" || am <= 0) {
			throw new Error("Invalid am");
		}

		const senderBalance = await connection.getBalance(keypair.publicKey);

		if (senderBalance < am * 1000000000) {
			throw new Error(
				"Sender does not have enough SOL to perform the transfer."
			);
		}
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: keypair.publicKey,
				toPubkey: recipientPublicKey,
				lamports: am* 1000000000,
			})
		);

		const signature = await sendAndConfirmTransaction(connection, transaction, [
			keypair,
		]);
		return {
            status:true,
            signature:signature,
            }

	} catch (error) {
		console.log(error);
        return {
            status:false,
            signature:null,
            }
	}
};