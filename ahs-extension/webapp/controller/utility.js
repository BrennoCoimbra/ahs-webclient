define([], function(){
    function StringJoin(arr, sep){
        return arr.join(sep);
    }
    return {
        StringJoin: StringJoin
    }
})