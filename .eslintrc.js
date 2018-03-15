module.exports = {
    "extends": "standard",
    'rules': {
        'arrow-parens': 0,
        'generator-star-spacing': 0,
        'no-undef': 0,
        'camelcase': 0,
        'no-return-assign': 0,
        'no-use-before-define': 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
      }
};