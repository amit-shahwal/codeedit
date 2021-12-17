const superagent = require("superagent");
var paiza_io = require("paiza-io");

const codes = require("./codeSchema");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.codifyapi = async (req, res) => {
  try {
    var sourcecode = req.body.code;

    const data = await superagent.post(
      `http://api.paiza.io:80/runners/create?source_code=${sourcecode}&language=python3&api_key=guest`
    );

    const data2 = JSON.parse(data.text);

    const id = data2.id;
    res.status(200).json({
      id,
    });
  } catch (err) {}
};
exports.codifyall = async (req, res) => {
  var sourcecode = req.body.code;
  var language = req.body.language;
  var data;
  var input = req.body.input;

  if (
    language !== "cpp" &&
    language !== "python3" &&
    language !== "javascript"
  ) {
    return res.status(200).json({
      output: "",
      error: `Please Select a Proper language`,
    });
  }

  if (language === "cpp") {
    paiza_io("cpp", sourcecode, input, function (error, result) {
      if (error) {
        // console.log(error);
        return res.status(200).json({
          error: `Proper Input Size , their can be certian reasons for this error ,filesize,inputsize,payloadsize...`,
        });
      }

      // console.log(error);
      res.status(200).json({
        output: result.stdout,
        error: `${result.stderr}${result.build_stderr}`,
      });
    });
  } else {
    paiza_io(language, sourcecode, input, function (error, result) {
      if (error) {
        // console.log(error);
        return res.status(200).json({
          error: `Proper Input Size , their can be certian reasons for this error ,filesize,inputsize,payloadsize...`,
        });
      }

      res.status(200).json({
        output: result.stdout,
        error: `${result.stderr}${result.build_stderr}`,
      });
    });
  }
};
exports.statuss = async (req, res) => {
  try {
    const idd = req.body.id;
    const datacode = await superagent.get(
      `http://api.paiza.io:80/runners/get_details?id=${idd}&api_key=guest`
    );
    const data3 = JSON.parse(datacode.text).stdout;
    const data4 = JSON.parse(datacode.text).stderr;

    res.status(200).json({
      output: data3,
      error: data4,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.saveCode = async (req, res) => {
  try {
    const ds = await codes.find({ name: req.body.user_name });

    if (ds.length === 0 || ds[0].code.length != 3) {
      if (ds.length === 0) {
        const cs = await codes.create({
          name: req.body.user_name,
          code: [req.body.code],
        });

        res.status(200).json({
          cs,
        });
      } else {
        await codes.findOneAndUpdate(
          { name: req.body.user_name },
          { $push: { code: req.body.code } }
        );
      }
    } else {
      const ds = await codes.find({ name: req.body.user_name });
      var to_pull = ds[0].code[0];
      // console.log(to_pull);
      await codes.findOneAndUpdate(
        { name: req.body.user_name },
        { $pull: { code: to_pull } }
      );
      await codes.findOneAndUpdate(
        { name: req.body.user_name },
        { $push: { code: req.body.code } }
      );
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getSavedCode = async (req, res) => {
  try {
    const ds = await codes.find({ name: req.body.user_name });
    if (ds.length == 0) {
      return res.status(200).json({
        code: ds,
      });
    }
    // console.log(ds[0].code);

    res.status(200).json({
      code: ds[0].code,
    });
  } catch (error) {
    console.log(error);
  }
};
