import React, {FC} from 'react';
import {Text} from 'ink';
// import * as depGrpc from 'grpc'

// import { PullFileBackupResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';
// import { PullDatabaseBackupResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';

interface FileComponentType {
	name: string,
	// stream: depGrpc.ClientReadableStream<PullFileBackupResponse>
}

export const FileC: FC<FileComponentType> = ({name = ''}) => {
	
	return (
		<Text>
			Successfully downloaded: <Text color="green">{name}</Text>
		</Text>
	)
}