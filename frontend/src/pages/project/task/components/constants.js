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
import uploadSequenceLabelingConll from '@/assets/examples/upload_sequence_labeling.conll';

export const TextClassificationProject = {
  plaintext: {
    label: 'Plain',
    format: uploadTextClassificationTxt,
  },
  csv: { label: 'CSV', format: uploadTextClassificationCsv },
  json: {
    label: 'JSONL',
    format: uploadTextClassificationJsonl,
  },
  excel: {
    label: 'Excel',
    format: uploadTextClassificationXlsx,
  },
};
export const SequenceLabelingProject = {
  plaintext: {
    label: 'Plain',
    format: uploadSequenceLabelingTxt,
  },
  conll: {
    label: 'Conll',
    format: uploadSequenceLabelingConll,
  },
  json: {
    label: 'JSONL',
    format: uploadSequenceLabelingJsonl,
  },
};

export const Seq2seqProject = {
  plaintext: {
    label: 'Plain',
    format: uploadSeq2seqTxt,
  },
  csv: {
    label: 'CSV',
    format: uploadSeq2seqCsv,
  },
  json: {
    label: 'JSONL',
    format: uploadSeq2seqJsonl,
  },
  excel: {
    label: 'Excel',
    format: uploadSeq2seqXlsx,
  },
};
