import config from "./helpers/config";
import io from "./methods/index";
import log from "./services/logger";

const start = async (): Promise<void> => {
	try {
		//await connect();
		log.info(`socket client serving on http://localhost:${config.PORT}/socket.io/socket.io.js`);
		io.listen(config.PORT);
	} catch (e) {
		log.error(e);
		throw Error(e);
	}
};

start();