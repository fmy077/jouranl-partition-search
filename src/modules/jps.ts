import { REQUEST_URL_PREFIX } from "./config"
export async function searchPartitionByName(){
    try{
        let items: Zotero.Item[] = [];
        items = ztoolkit.getGlobal("ZoteroPane").getSelectedItems();
        for(let item of items){
            if(item.itemType != "journalArticle")continue;
            let journal_issn = item.getField('ISSN');
            ztoolkit.log("【search】")
            ztoolkit.log(REQUEST_URL_PREFIX + journal_issn)
            const resp =  await Zotero.HTTP.request("GET", REQUEST_URL_PREFIX + journal_issn);
            if (resp.status !== 200) {
                Zotero.log("error request")
                throw new Error(`HTTP error! Status: ${resp.status}`);
            }
            const json_data = JSON.parse(resp.responseText).data;
            const res = json_data.partitionCas?json_data.partitionCas:"无分区信息"
            await ztoolkit.ExtraField.setExtraField(item, 'partition-cas', res)
            ztoolkit.log(json_data)
            item.saveTx();
        }
    }catch (error) {
        ztoolkit.log("------------------------------------");
        ztoolkit.log(`"journalpartitionsearch error: ${error}`);
      }
    
}