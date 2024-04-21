const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
///////////////////////////////////////////
const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
//////////////////////////////////////////////
const fs = require("fs");
const path = require("path");
///////////////////////////////////////////
const mongoose = require("mongoose");

const MongoClient = require("mongodb").MongoClient;
///////////////////////////////////////////
app.use(express.json());
app.use(cors());
app.use(express.static("src"));

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
};

//__________________________________
  //config storage
  const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  })

    const upload = multer({storage:Storage})

    app.post("/uploadImage", upload.single("image"), async (req, res) => {
      const {title,description} = req.body;
      const productpic = req.file.originalname
      console.log(file)
      res.status(201).send("image upload successfully")
      /* res.status(201).send("image upload successfully") */
        console.log(title,description,productpic)
    });
    //______________
    //image Shema

    const Image = mongoose.model(
    "Imageuploading",new mongoose.Schema({
        title:String,
        description:String,
        productpic:{
          data:Buffer,
          type:String
        }
    })
  );
//_______________________________
// dashboard revenue collection

app.get("/revenue/Dashboard", async (req, res) => {
  try {
    const result = await Sales.find();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// profit chart
app.get("/profit/profitchart", async (req, res) => {
  try {
    const result = await Sales.find();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).send(err.message);
  }
});
//sales analytics

const Sales = mongoose.model(
  "salesdetails",
  new mongoose.Schema({
    date: Date,
    salesrevenue: Number,
    costofgoods: Number,
    grossprofit: Number,
  })
);

app.post("/api4/salesanalytics", async (req, res) => {
  const newSales = new Sales(req.body);
  const saveSales = await newSales.save();
  res.send(saveSales);
});
app.get("/api4/salesanalytics", async (req, res) => {
  try {
    const result = await Sales.find();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// Order Processing

const Order = mongoose.model(
  "Orders",
  new mongoose.Schema({
    orderID:Number,
    type:String,
    quantity:Number,
    name:String,
    shippingaddress:String,
    status:String,
    price:Number
  })
);

app.get("/api3/orderstatus", async (req, res) => {
  try {
    const result = await Order.find();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

// Inventory managing

const Invents = mongoose.model(
  "inventories",
  new mongoose.Schema({
    date: Date,
    category: String,
    quantity: Number,
    purchaseprice: Number,
    totalamount: Number,
    stocks: Number,
  })
);

app.post("/api2/inventory", async (req, res) => {
  const newInvents = new Invents(req.body);
  const saveInvents = await newInvents.save();
  res.send(saveInvents);
});

app.get("/api2/inventory", async (req, res) => {
  try {
    const result = await Invents.find();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

//product managing
const Product = mongoose.model(
  "productlist",
  new mongoose.Schema({
    title: String,
    description: String,
    image: String,
  })
);

app.post("/api1/productlists", async (req, res) => {
  const newProduct = new Product(req.body);
  const saveProduct = await newProduct.save();
  res.send(saveProduct);
});

app.get("/api1/productlists", async (req, res) => {
  try {
    const result = await Product.find();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).send(err.message);
  }
});

connectDB();
app.listen(PORT, () => {
  console.log(`server running http://localhost:${PORT}`);
});
