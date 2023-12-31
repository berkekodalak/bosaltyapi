module.exports = async (client, emoji) => {

  if (!emoji.guild) return;

  const guildData = await client.database.fetchGuild(emoji.guild.id);

  let logger = guildData.logger;
  if (!logger?.webhook) return;

  try {

    //Log Executor
    let fetchedLogs = await emoji.guild.fetchAuditLogs({
      limit: 1,
      type: 60,
    });
    let log = fetchedLogs.entries.first();
    let logExecutor = log.executor;

    let embed = {
      color: client.settings.embedColors.green,
      title: `**»** Bir emoji oluşturuldu!`,
      thumbnail: {
        url: emoji.url,
      },
      fields: [
        {
          name: '**»** Emoji Adı',
          value: `**•** ${emoji.name}`,
          inline: false
        },
        {
          name: '**»** Emoji ID',
          value: `**•** ${emoji.id}`,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        text: `${logExecutor.tag} tarafından oluşturuldu.`,
        icon_url: logExecutor.displayAvatarURL(),
      },
    };

    //Logging
    require('../functions/logManager')(client, guildData, { embeds: [embed] });

  } catch (err) { require('../functions/logManager').errors(client, guildData, err); };
};
