import media from "./media.json";
import Essay from "./entity/Essay";
import introduction from "./section-1-introduction";
import observations from "./section-2-observations";
import explore from "./section-3-explore-3d-data";
import appendix from "./section-4-appendix";

export default new Essay([introduction, explore, appendix], media);
