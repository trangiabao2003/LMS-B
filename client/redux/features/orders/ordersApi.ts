import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (type) => ({
        url: `get-orders`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getStripePublishablekey: builder.query({
      query: () => ({
        url: `payment/stripepublishablekey`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createPaymentIntent: builder.mutation({
      query: (amount) => ({
        url: "payment",
        method: "POST",
        body: { amount },
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        body: {
          courseId,
          payment_info,
        },
        method: "POST",
        credentials: "include" as const,
      }),
      invalidatesTags: ["CoursePurchased"], // Invalidate cache on order creation
    }),
    checkCoursePurchased: builder.query({
      query: (courseId) => ({
        url: `check-purchased/${courseId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["CoursePurchased"], // Cache tag
    }),
  }),
});

export const { 
  useGetAllOrdersQuery, 
  useGetStripePublishablekeyQuery, 
  useCreatePaymentIntentMutation, 
  useCreateOrderMutation,
  useCheckCoursePurchasedQuery 
} = ordersApi;