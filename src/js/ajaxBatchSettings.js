        //   let carregaCardioAjaxBatch = () => {
        //     let importDate = new moment().format('YYYY-MM-DD')

        //     fetch(`https://api.fitbit.com/1/user/-/activities/heart/date/${importDate}/1d/1sec/time/00:00/23:59.json`, fitbitSettings)
        //     .then(res => res.json())
        //     .then(json => {

        //       let intraday = json['activities-heart-intraday'].dataset
        //       let endpoint = odata.url;
        //       let dataCast = (intra) => {
        //         return {
        //           GroupId: groupsId.cardio.frequencia.id,
        //           CollectionDate: new moment(new Date(importDate+'T'+intra.time)).format('YYYY-MM-DDTHH:mm:ssZ'),
        //           DecimalValue: parseFloat(intra.value)
        //         } 
        //       }
        //       let dataArray = intraday.map(i => dataCast(i))
        //       let batchSettings = createAjaxBatchSettings(endpoint)
        //       .postBatch(odata.exams.decimals.point, dataArray)

        //       $.ajax(batchSettings).done(function (response) {
        //         console.log('total reg: ' + intraday.length)
        //         console.log('total OK: ' + (response.match(/HTTP\/1.1 200/g) || []).length)
        //         console.log('total Created: ' + (response.match(/HTTP\/1.1 201/g) || []).length)
        //         console.log('total Conflict: ' + (response.match(/HTTP\/1.1 409/g) || []).length)
        //       });
        //     });
        //   }
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });

    return uuid;
};

//       let batchSettings = createAjaxBatchSettings(endpoint)
//       .postBatch(odata.exams.decimals.point, dataArray)
//       $.ajax(batchSettings).done(function (response) {
//         console.log('total reg: ' + intraday.length)
//         console.log('total OK: ' + (response.match(/HTTP\/1.1 200/g) || []).length)
//         console.log('total Created: ' + (response.match(/HTTP\/1.1 201/g) || []).length)
//         console.log('total Conflict: ' + (response.match(/HTTP\/1.1 409/g) || []).length)
//       });
function createAjaxBatchSettings (rootUri) {
    let batchGuid = generateUUID();

    let addBatch = (settings, rootUri, batchGuid, method, link, data) => {

        let endBatch = `--batch_${batchGuid}--`

        if(settings.data) {
        settings.data.replace(endBatch, '');
        }

        let newChangeSetGuid = generateUUID();
        var batchContents = new Array();

        batchContents.push("--batch_" + batchGuid);
        batchContents.push("Content-Type: multipart/mixed; boundary=changeset_" + newChangeSetGuid);
        batchContents.push("");
        batchContents.push("--changeset_" + newChangeSetGuid);
        batchContents.push("Content-Type: application/http");
        batchContents.push("Content-Transfer-Encoding: binary");
        batchContents.push("Content-ID: 1");
        batchContents.push("");
        batchContents.push(`${method} ${rootUri}${link} HTTP/1.1`);
        batchContents.push('Content-Type: application/json');
        batchContents.push("");
        batchContents.push(JSON.stringify(data));
        batchContents.push(`--changeset_${newChangeSetGuid}--`);

        let newChangeSet = batchContents.join("\r\n");
        settings.data += newChangeSet + "\r\n" + endBatch;

        return settings;
    }

    let postBatch = (settings, link, dataArray) => {
        let ret = settings 
        dataArray.forEach(element => {
        ret = settings.addBatch('POST', link, element)
        });

        return ret;
    }

    let settings = {
        url: rootUri  + "/$batch",
        method: "POST",
        headers: {
        "Content-Type": "multipart/mixed;boundary=batch_" + batchGuid,
        "cache-control": "no-cache",
        },
        addBatch: (method, link, data) => addBatch(settings, rootUri, batchGuid, method, link, data),
        postBatch: (link, dataArray) => postBatch(settings, link, dataArray)
    }

    return settings;
}

