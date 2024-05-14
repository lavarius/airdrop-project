const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js")

const wallet = new Keypair()

const publicKey = new PublicKey(wallet._keypair.publicKey)
const secretKey = wallet._keypair.secretKey

const getWalletBalance = async() => {
    try {
        // create connection object to get balance
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        // get balance of wallet with a specific publicKey
        const walletBalance = await connection.getBalance(publicKey)
        console.log(`Wallet balance: ${walletBalance}`)
    } catch(err) {
        console.error(err)
    }
}

// empty function to airdrop some SOL into our wallet
const airDropSol = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const fromAirDropSignature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL)
        // Get the current slot
        const currentSlot = await connection.getSlot();
        console.log(`current slot is: ${currentSlot}`)
        // Use a BlockheightBasedTransactionConfirmationStrategy with a buffer
        const confirmationStrategy = {
            strategy: 'blockheight',
            blockheight: currentSlot + 5, // Adjust the buffer as needed
        };
        await connection.confirmTransaction(fromAirDropSignature, confirmationStrategy)
    } catch(err) {
        console.error(err)
    }
}

// test the feature of getting WalletBalance by running a function that runs our code
const main = async () => {
    await getWalletBalance()
    await airDropSol()
    await getWalletBalance()
}

main()