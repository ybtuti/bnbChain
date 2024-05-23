const contractAddress = '0x8B547874B8bC7082bD16A298616642bd91Ec1d57';
const abi = [
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_note",
                    "type": "string"
                }
            ],
            "name": "setNote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getNote",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "note",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
]

const provider = new ethers.providers.Web3Provider(window.ethereum, 97);

let signer;
let contract;

provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(contractAddress, abi, signer);
    });
});

async function setNote(){
    const note = document.getElementById('note').value;
    await contract.setNote(note);
}

async function getNote() {
    const note = await contract.getNote();
    document.getElementById('note').innerText = note;
}