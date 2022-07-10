module.exports = (function () {
    const validate = function () {
        debugger;
        console.log(this.data);
    };

    const utils = () => {
        return function (req) {
            req.utils = req.utils ? req.utils : {};
            req.utils.validate = validate.bind(req);
        }
    }

    return { utils };
})();