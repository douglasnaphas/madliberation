const getEditLink = [
  (req, res, next) => {
    res.send({ data: { sederCode: "SOME-SEQU-ENCE-LTRS" } });
  },
];
module.exports = getEditLink;
