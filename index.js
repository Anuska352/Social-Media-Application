import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"; //help us properly set up the path for directories
import { fileURLToPath } from "url"; //help us properly set up the path for directories
import authRoutes from "./routes/auth.js";
import {register} from "./controllers/auth.js";


/* Configurations */
const __filename = fileURLToPath(import.meta.url); // to grab file url
const __dirname = path.dirname(__filename); 
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets'))); //set the directory of where we keep our assets, we will store it locally here

/* FILE STORAGE */
const storage = multer. diskStorage({
    destination: function(req,res,cb){
        cb(null, "public/assets");//save in this particular folder
    },
    filename : function(req,file,cb){
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);


/* Routes*/
app.use("/auth", authRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; // || 6001 stands for an alternate server
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));


