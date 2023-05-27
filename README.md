# postgresqCloudApp
pierwsza apka chmurowa z baza danych

mkdir kolkoikrzyzyk

cd kolkoikrzyzyk

gsutil rsync -r gs://sample-code-repo/kolkoikrzyzyk . 


cd kolkoikrzyzyk
gcloud app deploy

gcloud app browse
