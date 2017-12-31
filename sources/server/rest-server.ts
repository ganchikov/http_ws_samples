import * as express from "express";
import * as path from "path";
const app = express();

class Product {
    constructor(
        public id: number,
        public title: string,
        public price: number
    ) {}

    private static products = [
        new Product(1, 'ABCD7778', 100),
        new Product(2, 'EFG', 150),
        new Product(3, 'HIJ', 34),
        new Product(4, 'ZZZ', 78),
        new Product(100, 'XXX123456', 42)
    ]

    static getProducts() : Product[] {
        return this.products ; 
    }

    static getProductById(id: number) : Product {
        return this.products.find(p => p.id == id);
    }
}               

app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.use('/node_modules', express.static(path.join(__dirname, '..','..', 'node_modules')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../client/main.html'))
    console.log('requested landing page');
});
app.get('/products', (req,res) => {
    res.json(Product.getProducts());
    console.log('requested products endpoint');

});
app.get('/products/:id', (req,res) => {
    const prod: Product = Product.getProductById(req.params.id);
    res.json(prod);
    console.log(`requested product ${prod.title}`);
});
app.get('/reviews', (req,res) => {
    res.send('requested reviews endpoint');
    console.log('requested reviews endpoint');
}
);

const server = app.listen(8000, 'localhost', () => {
    const {address, port} = server.address();
    console.log('Listening on http://localhost:' + port);

});

