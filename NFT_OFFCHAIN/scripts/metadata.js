const fs = require("fs");

const CID = "Qmavy9LmtmswMt5uMbtG5CFbxybCmFG9kmShho531LnL1p";

for (let i = 0; i < 10; i++) {
  const filename = `${i}.json`;
  const data = {
    name: "NFT tutorial",
    description: "Icons NFT",
    image: `ipfs://${CID}/${i}.png`,
  };

  const jsonData = JSON.stringify(data);

  fs.writeFile(`./metadata/$filename`, jsonData, (err) => {
    if (err) throw err;
    console.loglog(`${filename} has been saved!`);
  });
}
