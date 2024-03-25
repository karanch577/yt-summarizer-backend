const errorMiddleware = (err, _req, res, next) => {
    console.log("error message", err.message)

    res.status(err.code ?? 500).json({
        success: false,
        message: err.message
    })
}

export default errorMiddleware