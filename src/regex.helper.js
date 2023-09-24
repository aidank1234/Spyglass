export async function matchRegex(codeTomatch, regexPattern) {
	const pattern = new RegExp(regexPattern);
	return pattern.test(codeTomatch) ? "Yes" : "No";
}