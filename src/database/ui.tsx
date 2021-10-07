import React, {FC} from 'react';
import {Text} from 'ink';

export const FileC: FC<{name?: string}> = ({name = ''}) => (
	<Text>
		Successfully uploaded: <Text color="green">{name}</Text>
	</Text>
);

export const DatabaseC: FC<{name?: string}> = ({name = ''}) => (
	<Text>
		Successfully uploaded: <Text color="green">{name}</Text>
	</Text>
);
