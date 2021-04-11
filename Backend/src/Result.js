export default class Result{
    static Success(success){
        return new Result(success, null, false)
    }
    static Error(error){
        return new Result(null, error, true)
    }
    constructor(success, error, isError){
        this.success = success
        this.error = error
        this.isError = isError
    }

    get(){
        return ((!this.isError) ? this.success : this.error)
    }
}