import router from 'express';

export const route = router();

route.get('/', (req, res) => {
    res.send({
        message: "Here the data",
        data: {
            name: "Rahul",
            age: 20,
        }
    });
});

route.get('/add/:num1/:num2', (req, res) => {
    const num1 = parseInt(req.params.num1);
    const num2 = parseInt(req.params.num2);
    res.send({
        result: num1 + num2
    });
});