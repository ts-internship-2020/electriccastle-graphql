const helloWorldResolvers = {
    Query: {
        myFirstEndpoint: async (_parent, _arguments, _context, _info) => {
            return "Jupane ce mai intreprinzi?"
        }
    }
};

module.exports = helloWorldResolvers;