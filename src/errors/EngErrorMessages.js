export default (error) => {
  const messages = {
    'parsing error': 'Parsing error',
    double: 'This feed is allready added',
    400: 'Bad request',
    403: 'Access to the resource is denied',
    404: 'Page not found',
    408: 'Server request timeout',
    500: 'Internal Server Error',
    502: 'Received an incorrect response from the upstream server',
  };
  return `Ups, ${messages[error]}!`;
};
