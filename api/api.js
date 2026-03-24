// copilot created
const selected = require("../configurated.json");

function toRedirectTarget(value) {
	if (typeof value !== "string" || value.length === 0) {
		return null;
	}

	// Keep absolute URLs untouched; make relative paths root-relative.
	if (/^https?:\/\//i.test(value)) {
		return value;
	}

	return value.startsWith("/") ? value : `/${value}`;
}

module.exports = function handler(req, res) {
	const query = req.query || {};
	const params = Object.keys(query);

	const selectedKey = params.find((param) => Object.prototype.hasOwnProperty.call(selected, param));

	if (!selectedKey) {
		const available = Object.keys(selected);
		res.status(400).json({
			error: "No matching query parameter found.",
			available,
			usage: `Use one of: ${available.map((key) => `?${key}`).join(", ")}`,
		});
		return;
	}

	const target = toRedirectTarget(selected[selectedKey]);

	if (!target) {
		res.status(500).json({
			error: `Selected value for '${selectedKey}' is invalid.`,
		});
		return;
	}

	res.redirect(307, target);
};
