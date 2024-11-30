import "dayjs/locale/nb";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.locale("nb");
dayjs.extend(advancedFormat);

export default dayjs;
