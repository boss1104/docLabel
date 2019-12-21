import uploadTextClassificationTxt from '@/assets/examples/upload_text_classification.txt';
import uploadTextClassificationCsv from '@/assets/examples/upload_text_classification.csv';
import uploadTextClassificationJsonl from '@/assets/examples/upload_text_classification.jsonl';
import uploadTextClassificationXlsx from '@/assets/examples/upload_text_classification.xlsx';
import uploadSeq2seqTxt from '@/assets/examples/upload_seq2seq.txt';
import uploadSeq2seqJsonl from '@/assets/examples/upload_seq2seq.jsonl';
import uploadSeq2seqCsv from '@/assets/examples/upload_seq2seq.csv';
import uploadSeq2seqXlsx from '@/assets/examples/upload_seq2seq.xlsx';
import uploadSequenceLabelingTxt from '@/assets/examples/upload_sequence_labeling.txt';
import uploadSequenceLabelingJsonl from '@/assets/examples/upload_sequence_labeling.jsonl';
// import uploadSequenceLabelingConll from '@/assets/examples/upload_sequence_labeling.conll';
import uploadPdfLabelingJsonl from '@/assets/examples/upload_pdf_labeling.jsonl';

export const TextClassificationProject = {
  json: {
    label: 'JSONL',
    format: uploadTextClassificationJsonl,
  },
  csv: { label: 'CSV', format: uploadTextClassificationCsv },

  excel: {
    label: 'Excel',
    format: uploadTextClassificationXlsx,
  },
  plain: {
    label: 'Plain',
    format: uploadTextClassificationTxt,
  },
};
export const SequenceLabelingProject = {
  json: {
    label: 'JSONL',
    format: uploadSequenceLabelingJsonl,
  },
  // conll: {
  //   label: 'Conll',
  //   format: uploadSequenceLabelingConll,
  // },
  plain: {
    label: 'Plain',
    format: uploadSequenceLabelingTxt,
  },
};

export const Seq2seqProject = {
  json: {
    label: 'JSONL',
    format: uploadSeq2seqJsonl,
  },
  csv: {
    label: 'CSV',
    format: uploadSeq2seqCsv,
  },

  excel: {
    label: 'Excel',
    format: uploadSeq2seqXlsx,
  },
  plain: {
    label: 'Plain',
    format: uploadSeq2seqTxt,
  },
};

export const PdfLabelingProject = {
  json: {
    label: 'JSONL',
    format: uploadPdfLabelingJsonl,
  },
  pdf: {
    label: 'PDF',
    format: 'Upload new PDF file',
  },
};
