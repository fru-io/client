import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import {useStdout} from 'ink';
import * as grpc from '@grpc/grpc-js'
import * as depGrpc from 'grpc'
import * as jspb from "google-protobuf";


interface IProps<T,R> extends FC {
	req: T
	meta: grpc.Metadata
    method (argument: T, metadataOrOptions: depGrpc.Metadata | depGrpc.CallOptions, callback: depGrpc.requestCallback<R>)
}

// TODO: How we might implement a generic component
export function JSONComponent<T,R>(props: PropsWithChildren<IProps<T,R>>) {

	const {write} = useStdout();
	const [resp, setResp] = useState<R>()
	const [err, setError] = useState<depGrpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
            props.method(props.req, props.meta, (error: depGrpc.ServiceError | null, value?: R) => {
				if (error) {
					setError(error)
				}
				setResp(value)
			})
		}
		// Execute the created function directly
		init();
	  }, [props]);

	  if (err) {
		write(JSON.stringify(err))
		return null
	  }
	  if (resp) {
        if ( resp instanceof jspb.Message ) {
            write(JSON.stringify(resp.toObject()))
        }
		return null
	  } 

	  return null
}