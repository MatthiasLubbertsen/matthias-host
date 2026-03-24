// copilot generated
const fs = require("fs");
const path = require("path");

const FILES_DIR = path.join(process.cwd(), "files");

function getRequestedPath(req) {
	const query = req.query || {};

	if (typeof query.file === "string" && query.file.length > 0) {
		return query.file;
	}

	if (typeof query.path === "string" && query.path.length > 0) {
		return query.path;
	}

	// Fallback for possible nested route usage (e.g. /api/files/some.jpg).
	const urlPath = (req.url || "").split("?")[0] || "";
	const nestedPath = urlPath.replace(/^\/api\/files\/?/, "");

	return nestedPath;
}

module.exports = function handler(req, res) {
	const requestedPath = getRequestedPath(req);

	if (!requestedPath) {
		res.status(404).send("Not Found");
		return;
	}

	const safeRelativePath = requestedPath.replace(/^\/+/, "");
	const targetPath = path.resolve(FILES_DIR, safeRelativePath);

	if (!targetPath.startsWith(`${FILES_DIR}${path.sep}`)) {
		res.status(404).send("Not Found");
		return;
	}

	if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
		res.status(404).send("Not Found");
		return;
	}

	res.sendFile(targetPath);
};
