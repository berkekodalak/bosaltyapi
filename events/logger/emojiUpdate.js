module.exports = async (client, oldEmoji, newEmoji) => {

  if (!newEmoji.guild) return;

  const guildData = await client.database.fetchGuild(newEmoji.guild.id);

  let logger = guildData.logger;
  if (!logger?.webhook) return;

  try {

    //Log Executor
    let fetchedLogs = await newEmoji.guild.fetchAuditLogs({
      limit: 1,
      type: 61,
    });
    let log = fetchedLogs.entries.first();
    let logExecutor = log.executor;

    let embed = {
      color: client.settings.embedColors.blue,
      title: `**»** Bir emoji adı düzenlendi!`,
      thumbnail: {
        url: newEmoji.url,
      },
      fields: [
        {
          name: '**»** Eski Adı',
          value: `**•** ${oldEmoji.name}`,
          inline: true
        },
        {
          name: '**»** Yeni Adı',
          value: `**•** ${newEmoji.name}`,
          inline: true
        },
        {
          name: '**»** Emoji ID',
          value: `**•** ${newEmoji.id}`,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        text: `${logExecutor.tag} tarafından düzenlendi.`,
        icon_url: logExecutor.displayAvatarURL(),
      },
    };

    //Logging
    require('../functions/logManager')(client, guildData, { embeds: [embed] });

  } catch (err) { require('../functions/logManager').errors(client, guildData, err); };
};
