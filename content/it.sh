for f in it/*-in.md
do
  diff <(awk -f txt2json.awk ${f}) ${f/%-in.md/-expected.json}
done