function makeOptions(method, body)
{
    var opts =
    {
        method: method,
        headers:
        {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    if(body)
    {
        opts.body = JSON.stringify(body);
    }
    return opts; 
}

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({
            status: res.status,
            fullError: res.json()
        });
    }
    return res.json();
}

export {makeOptions, handleHttpErrors};
