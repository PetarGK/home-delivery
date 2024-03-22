export const handle = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "test" }),
  };
};
