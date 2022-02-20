module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
  overrides: [
    {
      files: '.twilioserverlessrc',
      options: {
        parser: 'json5',
        singleQuote: false,
        quoteProps: 'preserve',
      },
    },
  ],
};
