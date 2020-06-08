module.exports = {
    response: function (res, status, data, statusCode) {
        const result = {};
        result.data = data || '';
        result.statusCode = statusCode || 200;
        result.status = status === 'success' ? true : false;

        return res.status(result.statusCode).json({
            success: result.status,
            data: result.data

        });
    }
};