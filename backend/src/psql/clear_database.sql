--administrasi
--DROP TABLE IF EXISTS adminacc CASCADE;

---forum
DROP TABLE IF EXISTS forum CASCADE;
--DROP TABLE IF EXISTS forumwrite CASCADE;
DROP TABLE IF EXISTS forummessage CASCADE;

--payment and payment log 
DROP TABLE IF EXISTS paymentlog CASCADE;
DROP TABLE IF EXISTS reportlog CASCADE;

--aplikasi

---account 
--DROP TABLE IF EXISTS identity CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS accountresource CASCADE;

---UMKM
--DROP TABLE IF EXISTS umkm CASCADE;
--DROP TABLE IF EXISTS umkmresource CASCADE;

---investasi
DROP TABLE IF EXISTS investasi CASCADE; 
DROP TABLE IF EXISTS investmentmessage CASCADE;

---expertise
DROP TABLE IF EXISTS expertise CASCADE;
DROP TABLE IF EXISTS expertisekonsultan CASCADE;

---konsultasi
DROP TABLE IF EXISTS consultation CASCADE;
DROP TABLE IF EXISTS consultationrating CASCADE;
DROP TABLE IF EXISTS consultationoffer CASCADE;
DROP TABLE IF EXISTS consultationmessage CASCADE;
