import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
}, {
  files: ['**/*.?([cm])[jt]s?(x)'],
  rules: {
    'react-refresh/only-export-components': ['off'],
  },
})
