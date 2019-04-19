import media from "./media.json";
import Essay from "./entity/Essay";
import introduction from "./section-1-introduction";
import explore from "./section-3-explore-3d-data";

export default new Essay([introduction, explore], media);
