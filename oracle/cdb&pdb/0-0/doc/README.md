##检测新CDB是否兼容即将插入的PDB
###1.
```sql
alter pluggable database PDB_WEATHER close;
```
###2.
```sql
BEGIN
  DBMS_PDB.DESCRIBE(
    pdb_descr_file => '/home/oracle/PDB_WEATHER.xml',
    pdb_name => 'PDB_WEATHER');
END;
/
```