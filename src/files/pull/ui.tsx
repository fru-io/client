import React, {FC} from 'react';
import {Text} from 'ink';

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

interface DatabaseComponentType {
	name: string,
	// stream: depGrpc.ClientReadableStream<PullDatabaseBackupResponse>
}

export const DatabaseC: FC<DatabaseComponentType> = ({name = ''}) => {
	return (
		<Text>
			Successfully downloaded: <Text color="green">{name}</Text>
		</Text>
	);
}
