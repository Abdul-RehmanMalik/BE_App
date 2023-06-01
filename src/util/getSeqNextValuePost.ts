import PostCounter from "../models/PostCounter";

export const getSequenceNextValuePost = async (seqName: string) => {
  const seqDoc = await PostCounter.findOne({ pid: seqName });
  if (!seqDoc) {
    await PostCounter.create({ pid: seqName, seq: 1 });
    return 1;
  }
  seqDoc.seq += 10;
  await seqDoc.save();
  return seqDoc.seq;
};
