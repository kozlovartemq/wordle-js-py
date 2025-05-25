import { goTofailure } from '../router'

const apiServer = import.meta.env.DEV ? 'http://localhost:8000' : 'http://localhost:8000'
const api_prefix = import.meta.env.DEV ? '/api/v1' : '/api/v1'

const baseFetch = async (url, config = {}, params) => {
    const defaultHeaders = {
        'Content-Type': 'application/json'
    }

    const _config = {
        headers: {
            ...defaultHeaders,
            ...(config.headers || {})
        },
        ...config
    }

    if (params) {
        _config.body = JSON.stringify(params)
    }

    try {
        const response = await fetch(`${apiServer}${api_prefix}${url}`, _config)
        const data = await response.json()

        if (response.status >= 500) {
            goTofailure()
            throw { status: response.status, data }
        }

        return {
            status: response.status,
            ok: response.ok,
            data
        }
    } catch (err) {
        goTofailure()
        throw err
    }
}

const fetchGet = (url, config) => {
    return baseFetch(url, config)
}

const fetchPost = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'POST'
    }, params)
}

const fetchPut = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'PUT'
    }, params)
}
const fetchPatch = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'PATCH'
    }, params)
}

const fetchDelete = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'DELETE'
    }, params)
}

export default {
    get: fetchGet,
    post: fetchPost,
    put: fetchPut,
    patch: fetchPatch,
    delete: fetchDelete,
}