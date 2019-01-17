function loadDictionaryFunctions(dictionary) {
    dictionary.forEach = (callBackFn) => {
        Object.keys(dictionary).forEach((key, index) => {
        callBackFn(dictionary[key], key)
        })
    }

    dictionary.map = (callBackFn) => {
        let ret = []

        dictionary.forEach((value, key) => {
        if(!Array.isArray(value)) {
            return;
        }
        let element = callBackFn(value, key)
        if(element) {
            ret.push(element)
        }
        })

        return ret;
    }

    dictionary.filter = (callBackFn) => {
        return dictionary.map((value, key) => {
        if(callBackFn(value, key)) {
            return value;
        }
        })
    }

    dictionary.keys = () => {
        return Object.keys(dictionary).filter(key => Array.isArray(dictionary[key]))
    }
}

function loadMomentPrototype(prototype) {
    prototype.time = () => {
        let hourStr = this.format('hh:mm:ss Z') 
        return new moment(hourStr, 'hh:mm:ss Z');
    }
}

function loadStringPrototype(prototype) {
    prototype.padLeft = (totalWidth, paddingChar = null) => {
        var ret = this;
        while (ret.length < (totalWidth || 2)) {
            ret = paddingChar + ret;
        }
        return ret;
    }
}

function loadArrayPrototype(prototype) {
      Array.prototype.GroupBy = function(callBackFn) {
        let ret = {}
        this.forEach(element => {
          let key = callBackFn(element)
          if(!ret[key]) {

            ret[key] = []
          }

          ret[key].push(element)
        })

        loadDictionaryFunctions(ret)
        return ret;
      }

      Array.prototype.Sum = function(callBackFn) {
        if(this.length==0) {
          return 0
        }
        return this.reduce((previous, current) => previous + callBackFn(current), 0)
      }

      Array.prototype.Average = function(callBackFn = null) {
        callBackFn = callBackFn ? callBackFn : item => item

        if(this.length==0) {
          return 0
        }
        return this.Sum(callBackFn) / this.length
      }

      Array.prototype.Distinct = function() {
        return this.filter((value, index, self) => self.indexOf(value) === index)
      }

      Array.prototype.Last = function() {
        return this[this.length-1]
      }
}

