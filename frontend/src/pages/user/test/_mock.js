const mock = {
  'GET /api/fetch': (req, res) => {
    // console.log(req.query);
    // const type = req.body.type;
    setTimeout(() => {
      if (req.query.type === 'error') {
        res.status(200).json({
          errCode: '-1',
          errMsg: '连接数据库错误啦',
          data: '',
        });
      } else {
        res.status(200).json({
          errCode: '0',
          data: 'hello 我是后端，注意，这里是mock数据，不是真实数据',
        });
      }
    }, 50);
  },
  'POST /api/manual/querySentencesList': (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: '0',
        data: [
          {
            id: 1,
            content:
              'Expert consensus on HBA1C c control targets in Chinese adult type 2 diabetes At present, type 2 diabetes and its complications have become one of the major diseases that endanger public health. Controlling blood sugar is one of the important measures to delay the progression of diabetes and its complications. Although HBA1C. It is a well-recognized indicator for evaluating the level of blood sugar control, but it is still controversial about the ideal level of control, that is, the target value. High-quality clinical studies such as the Diabetes Control and Complications Trial (DCCT, 1993), Kumamoto (1995), and the UK Prospective Diabetes Study (UKPDS, 1998) have confirmed that newly diagnosed diabetic patients or patients with milder conditions Strict glycemic control can delay the occurrence and development of diabetic microangiopathy. The follow-up studies DCCT-EDIC (2005) and UKPDS-80 (2008) also confirmed that early effective control of blood glucose also has protective effects on large blood vessels. These study endpoints were HBA1C. Controlled at about 7.5%, older people with diabetes, longer duration of diabetes, and some people with diabetes (CVD) or CVD with high risk factors further reduce blood sugar.',
            mark: {},
          },
          {
            id: 2,
            content:
              'Although HBA1C. It is a well-recognized indicator for evaluating the level of blood sugar control, but it is still controversial about the ideal level of control, that is, the target value.',
            mark: {},
          },
          {
            id: 3,
            content:
              'High-quality clinical studies such as the Diabetes Control and Complications Trial (DCCT, 1993), Kumamoto (1995), and the UK Prospective Diabetes Study (UKPDS, 1998) have confirmed that newly diagnosed diabetic patients or patients with milder conditions strict.',
            mark: {},
          },
          {
            id: 4,
            content:
              'Controlled at about 7.5%, then older people with longer diabetes, longer cardiovascular disease (CVD) or diabetes with high risk factors for CVD will further reduce blood sugar, what will be the impact on CVD?',
            mark: {},
          },
          {
            id: 5,
            content:
              'The Cardiovascular Risk Intervention Study (ACCORD) for Diabetes, the Veterans Diabetes Study (VADT), and the Diabetes and Cardiovascular Disease Action Study (ADVANCE) interventions for this group of people for an average of 5 years or so showed that intensive hypoglycemic therapy resulted in HBA1C.',
            mark: {},
          },
        ],
      });
    }, 50);
  },
  'POST /api/manual/queryLabelsList': (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: '0',
        data: [
          {
            labelId: 1,
            text: 'Disease',
            color: '#eac0a2',
            borderColor: '#8c7361',
          },
          {
            labelId: 2,
            text: 'Test',
            color: '#619dff',
            borderColor: '#3c619d',
          },
          {
            labelId: 3,
            text: 'Symptom',
            color: '#9d61ff',
            borderColor: '#613C9D',
          },
          {
            labelId: 4,
            text: 'Level',
            color: '#ff9d61',
            borderColor: '#995e3a',
          },
        ],
      });
    }, 50);
  },
  'POST /api/manual/queryConnectionsList': (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: '0',
        data: [
          {
            connectionId: 1,
            text: 'Relationship 1',
          },
          {
            connectionId: 2,
            text: 'Relationship 2',
          },
          {
            connectionId: 3,
            text: 'Relationship 3',
          },
        ],
      });
    }, 50);
  },

  'POST /api/manual/queryProjectsList': (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: '0',
        data: [
          {
            projectId: 1,
            name: 'Project_1',
          },
          {
            projectId: 2,
            name: 'Project_2',
          },
          {
            projectId: 3,
            name: 'Project_3',
          },
        ],
      });
    }, 50);
  },

  'POST /api/manual/queryAnnotation': (req, res) => {
    setTimeout(() => {
      res.status(200).json({
        errCode: '0',
        data: {
          labels: [],
          connections: [],
        },
      });
    }, 50);
  },
};
module.exports = mock;
