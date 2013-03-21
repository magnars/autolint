var config = module.exports;

config["Node tests"] = {
    environment: "node",
    tests: ["test/*.js"],
    extensions: [require("buster-lint")],
    "buster-lint": require("./autolint-config")
};