import express from "express";
import cookieParser from "cookie-parser";
import axios from 'axios';

const PORT = 5000;
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.post("/webhook", async (req, res) => {
  const apiUrl = 'https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus';
  const requestBody = {
    orderId: req.body.queryResult.parameters['number-integer']
  };
  try {
    const response = await axios.post(apiUrl, requestBody);
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric"
    };
    let formattedDate = new Date(response.data.shipmentDate);
    formattedDate = formattedDate.toLocaleDateString("en-US", options);
    res.send({ fulfillmentText: `Your order ${req.body.queryResult.parameters['number-integer']} will be shipped on ${formattedDate}` });
  } catch (error) {
    res.send({ fulfillmentText: 'Internal server error' });
  }
}
)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT} `);
});


