import axios from "axios";

// A mock function to mimic making an async request for data
export const fetchPurchases = async (page, limit) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/purchases?page=${page}&limit=${limit}`
    );

    let totalCashPurchases = 0;
    let totalCreditPurchases = 0;
    let totalCashAndCreditPurchases = 0;
    let totalPurchases = 0;

    response.data.results.forEach((item) => {
      const price = Number(item.totalPrice);
      totalPurchases += price;

      switch (item.paymentMethod) {
        case "cash":
          totalCashPurchases += price;
          break;
        case "credit":
          totalCreditPurchases += price;
          break;
        case "cashAndCredit":
          totalCashAndCreditPurchases += price;
          break;
      }
    });

    console.log({ d: response.data });

    return {
      ...response.data,
      totalCashAndCreditPurchases,
      totalCreditPurchases,
      totalPurchases,
      totalCashPurchases,
    };
  } catch (error) {
    console.log({ error });
  }
};

// A mock function to mimic making an async request for data
export const fetchNextInvoiceNo = async () => {
  console.log("requesting");
  try {
    const response = await axios.get(
      `http://localhost:5000/api/purchases/next-invoice`
    );
    return response.data;
  } catch (error) {
    console.log({ error });
  }
};
