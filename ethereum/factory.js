import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract( // Instancia del contracte de campaign factory
  JSON.parse(CampaignFactory.interface),
  "0xB1fa8691B2bFf32F617dc15fe6b5440b266Ea730"
);

export default instance;
